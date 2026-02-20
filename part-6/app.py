"""
Part 6: Homework - Product Inventory App
========================================
See Instruction.md for full requirements and hints.

How to Run:
1. Make sure venv is activated
2. Install: pip install flask flask-sqlalchemy
3. Run: python app.py
4. Open browser: http://localhost:5000
"""

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# =============================================================================
# STEP 1: Product Model (Already done for you)
# =============================================================================

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, nullable=False)


# =============================================================================
# STEP 2: Create your routes here
# =============================================================================

# Route 1: Home page - display all products
@app.route('/')
def index():
    search_query = request.args.get('search', '')
    # Filter products if search query exists
    if search_query:
        products = Product.query.filter(Product.name.contains(search_query)).all()
    else:
        products = Product.query.all()
    # Calculate Total Inventory Valuation
    total_value = sum(p.price * p.quantity for p in products)  
    return render_template('index.html', products=products, total_value=total_value)

# Route 2: Add product page - form to add new product
@app.route('/add', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        name = request.form['name']
        quantity = int(request.form['quantity'])
        price = float(request.form['price'])

        new_product = Product(
            name=name,
            quantity=quantity,
            price=price
        )

        db.session.add(new_product)
        db.session.commit()

        return redirect(url_for('index'))

    return render_template('add.html')


# Route 3: Delete product
@app.route('/delete/<int:id>')
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return redirect(url_for('index'))

# Route 4: Edit product page
@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_product(id):
    product = Product.query.get_or_404(id) # Find product by ID
    if request.method == 'POST':
        # Update values from the form
        product.name = request.form['name']
        product.quantity = int(request.form['quantity'])
        product.price = float(request.form['price'])
        
        db.session.commit() # Save changes to inventory.db
        return redirect(url_for('index'))
    return render_template('edit.html', product=product)

# =============================================================================
# STEP 3: Initialize database (Already done for you)
# =============================================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
