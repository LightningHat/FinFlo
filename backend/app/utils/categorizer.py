

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