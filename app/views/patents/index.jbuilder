json.array! @patents do |patent|
  json.company_full_name patent.company_full_name
  json.patent_num patent.patent_num
  json.year patent.year
end
