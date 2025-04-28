**Flask-based OCR tool for automation pipelines powered by Mistral**

Flask API made around Mistrall OCR focused model.
Simple plug into automation pipelines (process, scrape, interact)
Works with documents that consists grately of images (base64 extraction), tables, complex algebra, analysis…you name it... 


- black & white UI
- REST API endpoints for .JSON & .MD output
- Support for remote PDF URLs
- Automatic retry mechanism with exponential backoff
- error handling and logging 
- retains inteligence value of the original inside new, editable and restructured document digestable for AI.
- deploy anywhere (selfhost/Render/PythonAnywhere etc...)

More about Mistral OCR at official docs page and Google collab:
https://docs.mistral.ai/capabilities/document/
https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/structured_ocr.ipynb