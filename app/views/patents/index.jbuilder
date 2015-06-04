json.array! @patents do |patent|
  json.company_full_name patent.company_full_name
  json.patent_number patent.patent_number
  json.year patent.year
end
