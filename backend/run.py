from app import create_app

app = create_app()
@app.route("./")
def index():
    return "Hi it's a spending analyzer web app"

if __name__ == "__main__":
    app.run(debug=True)