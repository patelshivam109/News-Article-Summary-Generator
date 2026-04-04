from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.luhn import LuhnSummarizer

# Sample text (later this will come from news articles)
text = """
Mumbai is on high alert after the police received a WhatsApp message threatening dozens of blasts in the financial hub where the Ganesh festival is set to culminate tomorrow. The threat message claimed that 'human bombs' had been planted in 34 vehicles, and it would shake the entire city.

The threat message was received on the WhatsApp helpline of the traffic police's control room yesterday as the cops covered the city in a security net for Anant Chaturthi, which would mark the end of the 10-day Ganesh festival with the immersion ritual.

The sender identified himself as "Lashkar-e-Jihadi" and said that 14 Pakistani terrorists have entered India. About 400 kg of RDX will be used for the blast, which can "kill 1 crore people", the threat said.

Mumbai Police has become alert following the threat, and security deployment has been increased across the city. An official said the threat is being investigated from all angles and that the Anti-Terrorism Squad (ATS) has been informed.
"""

# Step 1: Parse the text
parser = PlaintextParser.from_string(text, Tokenizer("english"))

# Step 2: Choose summarizer (Luhn here)
summarizer = LuhnSummarizer()

# Step 3: Generate summary (2 sentences)
summary = summarizer(parser.document, 2)

# Print summary
for sentence in summary:
    print(sentence)
