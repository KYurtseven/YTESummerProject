# Use Python-3
FROM python

# Change the environment variable of Python to handle utf-8
ENV PYTHONIOENCODING=utf-8

# Change the directory to the working directory
WORKDIR /usr/src/app

# Copy the requirements into the working directory for
# dependency purposes
COPY requirements.txt ./

# Run pip the install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from YTESummerProject/src/flask into the
# current directory
COPY . .

## Finally, start the flask application with no arguments
CMD ["python", "app.py"]

