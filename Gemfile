source "https://rubygems.org"

ruby "3.3.0"

gem "rails", "~> 8.0.0"

# Database
gem "sqlite3", ">= 2.1"

# Web server
gem "puma", ">= 5.0"

# Asset pipeline
gem "propshaft"

# JavaScript with importmaps
gem "importmap-rails"

# Hotwire
gem "turbo-rails"
gem "stimulus-rails"

# JSON APIs
gem "jbuilder"

# Authentication (Rails 8 built-in)
gem "bcrypt", "~> 3.1.7"

# Caching
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching
gem "bootsnap", require: false

# Timezone data for Windows
gem "tzinfo-data", platforms: %i[windows jruby]

group :development, :test do
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
