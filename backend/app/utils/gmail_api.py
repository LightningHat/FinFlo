import os
import re
import base64
from datetime import datetime
from google.auth.transport.requests import Request  # type: ignore
from google.oauth2.credentials import Credentials  # type: ignore
from google_auth_oauthlib.flow import InstalledAppFlow  # type: ignore
from googleapiclient.discovery import build  # type: ignore

# Gmail API Scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Define categories and their associated keywords
CATEGORIES = {
    "Shopping": ["amazon", "flipkart", "myntra", "shop", "purchase", "order"],
    "Food": ["zomato", "swiggy", "uber eats", "food", "restaurant", "cafe"],
    "Travel": ["uber", "ola", "makemytrip", "flight", "train", "bus", "travel"],
    "Bills": ["electricity", "water", "gas", "bill", "payment"],
    "Entertainment": ["netflix", "spotify", "movie", "concert", "event"],
    "Health": ["pharmacy", "hospital", "med", "doctor", "health"],
    "Other": []  # Default category
}

def authenticate_gmail():
    """
    Authenticate the user and return Gmail API credentials.
    """
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def fetch_emails():
    """
    Fetch transaction emails from the user's Gmail inbox.
    """
    creds = authenticate_gmail()
    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(userId='me', labelIds=['INBOX'], q="subject:transaction").execute()
    messages = results.get('messages', [])
    emails = []
    for message in messages:
        msg = service.users().messages().get(userId='me', id=message['id']).execute()
        emails.append(msg)
    return emails

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

def categorize_transaction(subject, snippet):
    """
    Categorize a transaction based on the subject and snippet of the email.
    """
    # Combine subject and snippet for keyword search
    text = (subject + " " + snippet).lower()

    # Check for keywords in each category
    for category, keywords in CATEGORIES.items():
        for keyword in keywords:
            if keyword in text:
                return category  # Return the matching category

    # If no category matches, return "Other"
    return "Other"

def parse_transactions(emails):
    """
    Parse transaction details from emails and categorize them.
    """
    transactions = []
    for email in emails:
        payload = email['payload']
        headers = payload['headers']
        subject = next(header['value'] for header in headers if header['name'] == 'Subject')
        snippet = email['snippet']

        # Extract amount, merchant, and date
        amount = extract_amount(subject)
        merchant = extract_merchant(subject)
        date = extract_date(subject)

        # Categorize the transaction
        category = categorize_transaction(subject, snippet)

        transactions.append({
            'subject': subject,
            'snippet': snippet,
            'amount': amount,
            'merchant': merchant,
            'date': date,
            'category': category
        })
    return transactions

def main():
    """
    Main function to fetch, parse, and display transactions.
    """
    print("Fetching emails...")
    emails = fetch_emails()
    print(f"Found {len(emails)} emails.")

    print("Parsing transactions...")
    transactions = parse_transactions(emails)

    print("\nTransactions:")
    for transaction in transactions:
        print(f"Subject: {transaction['subject']}")
        print(f"Amount: ₹{transaction['amount']}")
        print(f"Merchant: {transaction['merchant']}")
        print(f"Date: {transaction['date']}")
        print(f"Category: {transaction['category']}")
        print("-" * 40)

if __name__ == '__main__':
    main()