class Proposals::EditForm < ApplicationForm
  form do |edit_form|
    source_loading_date = edit_form.builder.object.source_loading_date&.strftime("%Y-%m-%d %H:%M:%S")
    destination_unloading_date = edit_form.builder.object.destination_unloading_date&.strftime("%Y-%m-%d %H:%M:%S")

    edit_form.text_field(name: :source, label: "Source")
    edit_form.text_field(name: :destination, label: "Destination")
    edit_form.text_field(
      name: :source_loading_date,
      type: "datetime-local",
      label: "Source loading date",
      value: source_loading_date
    )
    edit_form.text_field(
      name: :destination_unloading_date,
      type: "datetime-local",
      label: "Destination unloading date",
      value: destination_unloading_date
    )

    edit_form.submit(name: "Update proposal", label: "Update proposal")
  end
end


