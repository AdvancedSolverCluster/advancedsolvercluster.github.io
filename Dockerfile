# FROM ruby:3.1
FROM my-jekyll-app:latest
WORKDIR /app
COPY . /app
RUN bundle install
CMD ["bundle", "exec", "jekyll", "build"]
CMD ["bundle", "exec", "jekyll", "serve", "--port", "5000", "--host", "0.0.0.0", "--skip-initial-build"]
RUN ls -al /app/_site/guide
RUN ls -al /app/_site/assets/images/cluster-status
RUN rm -rf /app/server-management
EXPOSE 5000