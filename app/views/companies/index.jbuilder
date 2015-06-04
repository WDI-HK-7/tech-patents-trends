json.array! @companies do |company|
  json.name company.name
  json.country company.country
  json.industry company.industry
  json.total_employee company.total_employee 
  json.engineers company.engineers
end
