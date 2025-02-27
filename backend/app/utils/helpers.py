import re
from datetime import datetime

def extract_amount(text):
    """
    Extract the transaction amount from the text.
    """
    # Example: "Your payment of ₹500.00 to Zomato was successful."
    match = re.search(r'₹(\d+\.\d{2})', text)
    if match:
        return float(match.group(1))
    return 0.0

def extract_merchant(text):
    """
    Extract the merchant name from the text.
    """
    # Example: "Your payment of ₹500.00 to Zomato was successful."
    match = re.search(r'to\s+([A-Za-z]+)', text)
    if match:
        return match.group(1)
    return "Unknown"

def extract_date(text):
    """
    Extract the transaction date from the text.
    """
    # Example: "Your payment of ₹500.00 to Zomato was successful on 2023-10-15."
    match = re.search(r'(\d{4}-\d{2}-\d{2})', text)
    if match:
        return datetime.strptime(match.group(1), '%Y-%m-%d')
    return datetime.now()