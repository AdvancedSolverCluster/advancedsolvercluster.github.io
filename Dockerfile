# Using official Ruby image as the base
FROM ruby:3.1
# FROM my-jekyll-app:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the application's files into the container
COPY . /app

# Install dependencies
RUN bundle install


# Perform cleanup and setup tasks
RUN ls -al /app/_site/guide  && \
    rm -rf /app/_site/assets/images/cluster-status  && \
    ln -s /cluster-status /app/_site/assets/images/cluster-status  && \
    ls -al /app/_site/assets/images/cluster-status  && \
    rm -rf /app/server-management

# Specify the command to run on container start
CMD ["bundle", "exec", "jekyll", "serve", "--port", "5000", "--host", "0.0.0.0", "--skip-initial-build", "--no-watch"]

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 5000
