require "google/cloud/translate"

# Initialize the Google Cloud Translate client
translate = Google::Cloud::Translate.new(version: :v3)

# Function to recursively translate JSON content
def translate_json(content, translate)
  case content
  when String
    response = translate.translate_text(
      contents: [content],
      target_language_code: "en",
      parent: "projects/AIzaSyARG0EuuCK-xF6CckB17t6YmpcYH3IN5eI"
    )
    response.translations.first.translated_text
  when Hash
    content.each_with_object({}) do |(key, value), result|
      result[key] = translate_json(value, translate)
    end
  when Array
    content.map { |value| translate_json(value, translate) }
  else
    content
  end
end

# Read the JSON file
file_path = "app/directions.json"  # Path to your JSON file
json_content = JSON.parse(File.read(file_path))

# Translate the JSON content
translated_content = translate_json(json_content, translate)

# Write the translated content to a new JSON file
output_path = "app/directions_en.json"  # Path to save the translated JSON file
File.write(output_path, JSON.pretty_generate(translated_content))

puts "Translation complete! Translated file saved to #{output_path}."
