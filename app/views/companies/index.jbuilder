json.array! @companies do |company|
  json.name company.name
  json.country company.country
  json.industry company.industry
  json.employees_num company.employees_num
  json.engineers_num company.engineers_num
end
