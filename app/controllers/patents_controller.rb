class PatentsController < ApplicationController
  def index
    @patents = Patent.all
  end
  def show
    @patent = Patent.find(params[:id])
    if @patent.nil? 
      render :json => {message: "Cannot find patent id #{params[:id]}"}
    end
  end
  def patents_params
    params.require(:patent).permit(:company_id)
  end
end
