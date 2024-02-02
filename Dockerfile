FROM ruby:3.1
WORKDIR /app
COPY . /app
RUN bundle install
CMD ["bundle", "exec", "jekyll", "serve", "--port", "5000", "--host", "0.0.0.0"]
RUN ls -al /app/_site/guide
RUN rm -rf /app/server-management
EXPOSE 5000
