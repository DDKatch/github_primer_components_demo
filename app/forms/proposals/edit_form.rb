# frozen_string_literal: true

module Proposals
  class EditForm < ImmediateValidationForm
    include Rails.application.routes.url_helpers

    def validations
      {
        source: -> { @builder.object.source&.empty? },
        destination: -> { @builder.object.destination&.empty? },
      }
    end

    def messages
      {
        source: "Cannot be empty",
        destination: "Cannot be empty",
      }
    end

    form do |validation_form|
      source_loading_date = validation_form.builder.object
        .source_loading_date&.strftime("%Y-%m-%d %H:%M:%S")
      destination_unloading_date = validation_form.builder.object
        .destination_unloading_date&.strftime("%Y-%m-%d %H:%M:%S")

      validation_form.text_field(
        validation_message: validations[:source].call && messages[:source],
        name: :source,
        label: "Source",
        required: true,
      )
      validation_form.text_field(
        validation_message: validations[:destination].call && messages[:destination],
        auto_check_src: proposal_form_validate_destination_path,
        name: :destination,
        label: "Destination",
        required: true,
      )
      validation_form.text_field(
        name: :source_loading_date,
        type: "datetime-local",
        label: "Source loading date",
        value: source_loading_date,
      )
      validation_form.text_field(
        name: :destination_unloading_date,
        type: "datetime-local",
        label: "Destination unloading date",
        value: destination_unloading_date,
      )

      validation_form.submit(
        name: "Update proposal",
        label: "Update proposal",
      )
    end
  end
end
