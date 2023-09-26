# frozen_string_literal: true

json.extract! proposal, :id, :source, :destination, :source_loading_date, :destination_unloading_date, :created_at,
              :updated_at
json.url proposal_url(proposal, format: :json)
