from flask import Blueprint, render_template, redirect, url_for, request, session
from .models import User, Transaction
from .utils.gmail_api import fetch_emails, parse_transactions
from . import db

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def index():
    return render_template('index.html')

@main_routes.route('/dashboard')
def dashboard():
    if 'email' not in session:
        return redirect(url_for('main.login'))
    
    user = User.query.filter_by(email=session['email']).first()
    transactions = Transaction.query.filter_by(user_id=user.id).all()
    return render_template('dashboard.html', transactions=transactions)

@main_routes.route('/login')
def login():
    return render_template('login.html')

@main_routes.route('/auth')
def auth():
    # Handle Gmail OAuth here (explained later)
    return redirect(url_for('main.dashboard'))

@main_routes.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.index'))