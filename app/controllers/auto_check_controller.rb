class AutoCheckController < ApplicationController
  skip_before_action :verify_authenticity_token

  def validate_destination
    destination = params[:value]
    case destination
    when ->(x) { x&.empty? } 
      return render(
        status: :unprocessable_entity, 
        plain: "Cannot be empty"
      )
    when ->(x) { x&.length < 3 } 
      return render(
        status: :unprocessable_entity, 
        plain: "Has to be longer than 3 symbols"
      )
    when ->(x) { x&.present? }
      return render(
        status: :ok, 
        plain: "thanks"
      )
    end
  end
end
