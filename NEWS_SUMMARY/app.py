from flask import Flask, render_template, request, jsonify
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.luhn import LuhnSummarizer
import requests
from newspaper import Article
from datetime import datetime
import pytz
from deep_translator import GoogleTranslator   #for translations
from gtts import gTTS
import os
import io
from flask import send_file
from flask_cors import CORS
# ---------------- APP SETUP ---------------- # 
app = Flask(__name__)
CORS(app)



LANGUAGE_MAP = {
    "en": "en",
    "hi": "hi",
    "mr": "mr",
    "te": "te",
    "bho": "hi"  # Bhojpuri not in gTTS → fallback to Hindi
}

# ---------------- HELPER ---------------- #
def generate_summary(text, sentence_count=3):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LuhnSummarizer()
    summary = summarizer(parser.document, sentence_count)
    return " ".join(str(sentence) for sentence in summary)

def translate_text(text, target_lang="en"):
    """Translate text to target language if not English."""
    if target_lang != "en" and text.strip():
        try:
            return GoogleTranslator(source="en", target=target_lang).translate(text)
        except Exception as e:
            return f"(Translation failed: {e}) {text}"
    return text
 

# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    return render_template("index.html")


# Text summarization page
@app.route("/summarize", methods=["GET", "POST"])
def summarize():
    summary = ""
    selected_language = "en"
    audio_file = None

    if request.method == "POST":
        input_text = request.form.get("text", "")
        selected_language = request.form.get("language", "en")

        if input_text.strip():
            # Generate English summary first
            summary = generate_summary(input_text, 5)

            # Translate if needed
            if selected_language != "en":
                try:
                    summary = GoogleTranslator(source="en", target=selected_language).translate(summary)
                except Exception as e:
                    summary = f"(Translation failed) {summary}"

            # ✅ Generate speech file
            try:
                tts = gTTS(text=summary, lang=selected_language)
                audio_path = "static/summary.mp3"
                tts.save(audio_path)
                audio_file = audio_path
            except Exception as e:
                print("TTS error:", e)

    return render_template(
        "summarize.html",
        summary=summary,
        selected_language=selected_language,
        audio_file=audio_file
    )

#tts route 
@app.route("/tts")
def tts():
    text = request.args.get("text", "")
    lang = request.args.get("lang", "en")
    lang = LANGUAGE_MAP.get(lang, "en")  # map unsupported → fallback

    if not text.strip():
        return "No text provided", 400

    try:
        tts = gTTS(text=text[:500], lang=lang)  # limit length for query safety
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)

        return send_file(
            mp3_fp,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="summary.mp3"
        )
    except Exception as e:
        return f"TTS error: {e}", 500

# News summarization page
#NEWS_API_KEY = "c3b643ed9650463b9f41a16675396f83"

NEWS_API_KEY = os.getenv("NEWS_API_KEY")


@app.route("/news", methods=["GET", "POST"])
def news():
    articles = []
    if request.method == "POST":
        keyword = request.form.get("keyword", "")
        language = request.form.get("language", "en")

        if keyword.strip():
            url = f"https://newsapi.org/v2/everything?q={keyword}&language=en&apiKey={NEWS_API_KEY}"
            response = requests.get(url).json()

            if response.get("articles"):
                for idx, article in enumerate(response["articles"][:10]):
                    # Generate summary
                    if article.get("content"):
                        summary = generate_summary(article["content"], 3)
                    else:
                        summary = "No content available for summarization."

                    # Translate summary
                    summary = translate_text(summary, language)
                    article["summary"] = summary
                    article["language"] = language  # 👈 Pass language for /tts route

                    # Format publishing date to IST
                    if "publishedAt" in article and article["publishedAt"]:
                        try:
                            dt = datetime.fromisoformat(article["publishedAt"].replace("Z", "+00:00"))
                            dt_ist = dt.astimezone(pytz.timezone("Asia/Kolkata"))
                            article["publishedAt"] = dt_ist.strftime("%B %d, %Y – %I:%M %p IST")
                        except Exception as e:
                            print("Date conversion error:", e)

                articles = response["articles"][:10]

    return render_template("news.html", articles=articles)


# About + Features
@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/features")
def features():
    return render_template("features.html")


# URL summarization page
@app.route("/url", methods=["GET", "POST"])
def summarize_url():
    result, audio_file = None, None
    if request.method == "POST":
        url = request.form.get("url", "").strip()
        language = request.form.get("language", "en")

        if url:
            try:
                # Fetch and parse the article
                article = Article(url)
                article.download()
                article.parse()

                title = article.title
                author = ", ".join(article.authors) if article.authors else "Unknown"
                published_at = article.publish_date

                # Convert UTC → IST
                if published_at:
                    ist = pytz.timezone("Asia/Kolkata")
                    published_at = published_at.astimezone(ist).strftime("%B %d, %Y – %I:%M %p IST")

                # Generate + translate summary
                article_text = article.text
                summary = generate_summary(article_text, 5)
                summary = translate_text(summary, language)

                # Generate TTS audio file
                if summary.strip():
                    audio_path = os.path.join("static", "summary.mp3")
                    tts = gTTS(text=summary, lang=language)
                    tts.save(audio_path)
                    audio_file = "summary.mp3"

                result = {
                    "title": title,
                    "author": author,
                    "publishedAt": published_at,
                    "summary": summary,
                    "url": url
                }

            except Exception as e:
                result = {"error": f"Failed to fetch article: {e}"}

    return render_template("url.html", result=result, audio_file=audio_file)


# ---------------- JSON API ROUTES (for React frontend) ---------------- #


@app.route("/api/summarize", methods=["POST"])
def api_summarize():
    data = request.get_json() or {}
    input_text = data.get("text", "")
    language = data.get("language", "en")
    sentence_count = int(data.get("sentence_count", 5))

    if not input_text.strip():
        return jsonify({"error": "No text provided"}), 400

    summary = generate_summary(input_text, sentence_count)
    if language != "en":
        try:
            summary = GoogleTranslator(source="en", target=language).translate(summary)
        except Exception:
            pass

    return jsonify({"summary": summary, "language": language})


@app.route("/api/news", methods=["POST"])
def api_news():
    data = request.get_json() or {}
    keyword = data.get("keyword", "")
    language = data.get("language", "en")
    sentence_count = int(data.get("sentence_count", 3))

    if not keyword.strip():
        return jsonify({"articles": []})

    url = f"https://newsapi.org/v2/everything?q={keyword}&language=en&apiKey={NEWS_API_KEY}"
    response = requests.get(url).json()
    articles = []
    if response.get("articles"):
        for article in response["articles"][:10]:
            if article.get("content"):
                summary = generate_summary(article["content"], sentence_count)
            else:
                summary = "No content available for summarization."

            summary = translate_text(summary, language)
            article["summary"] = summary
            article["language"] = language
            articles.append(article)

    return jsonify({"articles": articles})


@app.route("/api/url", methods=["POST"])
def api_url():
    data = request.get_json() or {}
    url = data.get("url", "").strip()
    language = data.get("language", "en")
    sentence_count = int(data.get("sentence_count", 5))

    if not url:
        return jsonify({"error": "No url provided"}), 400

    try:
        article = Article(url)
        article.download()
        article.parse()

        title = article.title
        author = ", ".join(article.authors) if article.authors else "Unknown"
        published_at = article.publish_date
        if published_at:
            ist = pytz.timezone("Asia/Kolkata")
            published_at = published_at.astimezone(ist).strftime("%B %d, %Y – %I:%M %p IST")

        article_text = article.text
        summary = generate_summary(article_text, sentence_count)
        summary = translate_text(summary, language)

        return jsonify({
            "title": title,
            "author": author,
            "publishedAt": published_at,
            "summary": summary,
            "url": url
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch article: {e}"}), 500


# ---------------- MAIN ---------------- #

if __name__ == "__main__":
    app.run(debug=True)

