json.array! @companies do |company|
  json.name company.name
  json.country company.country
  json.industry company.industry
  json.employees_num company.employees_num
  json.engineers_num company.engineers_num
  # json.patent_num company.patents.first.patent_num
  json.patent_num company.patents.find_by_year(params[:year]).patent_num
  json.year company.patents.find_by_year(params[:year]).year
end
