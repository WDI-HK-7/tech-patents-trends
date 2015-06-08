class CompaniesController < ApplicationController
  def index
    @companies = Company.all
  end
  def show
    @company = Company.find(params[:id])
    if @company.nil?
      render :json => {message: "Cannot find post with id=#{params[:id]}"}
    end
  end

  def company_params
    params.require(:company).permit(:name, :country, :industry)
  end
  
  def test
    @companies = Company.all
  end
end
