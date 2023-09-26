# frozen_string_literal: true

json.array! @proposals, partial: 'proposals/proposal', as: :proposal
