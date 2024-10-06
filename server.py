from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key here
openai.api_key = 'your_openai_api_key'

@app.route('/generate', methods=['POST'])
def generate_resume():
    data = request.get_json()
    job_title = data.get('title')
    job_description = data.get('description')

    print(f"Generating resume for job title: {job_title}")
    print(f"Job description: {job_description}")
    # Generate the resume content (HTML format)
    resume_html = f"""
    <html>
    <head><title>Tailored Resume</title></head>
    <body>
      <h1>Your Name</h1>
      <h2>Applying for: {job_title}</h2>
      <p>{job_description}</p>
      <!-- Add more resume sections and tailoring logic -->
    </body>
    </html>
    """

    return jsonify({'resume': resume_html})

if __name__ == '__main__':
    app.run(port=5000)

if __name__ == '__main__':
    app.run(debug=True)