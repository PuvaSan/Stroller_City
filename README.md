# 📚 Stroller City

Navigate Tokyo's intense network of subway sytems via elevators only.  

_DROP SCREENSHOT HERE_
<br>
App home: https://strollercity.org
   

## Getting Started
### Setup

Install gems
gem "bootstrap", "~> 5.2"
gem "devise"
gem "autoprefixer-rails"
gem "font-awesome-sass", "~> 6.1"
gem "simple_form", github: "heartcombo/simple_form"
gem "sassc-rails"
gem "geocoder"
gem 'ffi', '1.16.3'
#taggable
gem 'acts-as-taggable-on', '~> 10.0'
#favoritable
gem 'acts_as_favoritor'
# Gemfile
gem 'rest-client'
gem 'google-cloud-translate'
gem 'faraday'
bundle install
```

### ENV Variables
Create `.env` file
```
touch .env
```
Inside `.env`, set these variables. For any APIs, see group Slack channel.
```
CLOUDINARY_URL=your_own_cloudinary_url_key
RAPIDAPI_KEY=your_own_cloudinary_url_key(enable Transit_routes)
GOOGLE_MAPS_API_KEY=your_own_cloudinary_url_key
```

### DB Setup
```
rails db:create
rails db:migrate
rails db:seed
```

### Run a server
```
rails s
```

## Built With
- [Rails 7](https://guides.rubyonrails.org/) - Backend / Front-end
- [Stimulus JS](https://stimulus.hotwired.dev/) - Front-end JS
- [Heroku](https://heroku.com/) - Deployment
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Bootstrap](https://getbootstrap.com/) - Basic Styling
— [SCSS](https://getbootstrap.com/) — Styling
- [Figma](https://www.figma.com) — Prototyping

## APIs

- [Google Maps] - map, places
- [Navitime Rapid API] - transit

## Acknowledgements
- My 2 year old son whom loves his stroller dearly and would not leave the house without it.  

## Team Members
- [Brian Inphouva](https://www.linkedin.com/in/brian-inphouva/)
- [Ayano Fujita] (https://www.linkedin.com/in/ayano-fujita-872a03297/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License
