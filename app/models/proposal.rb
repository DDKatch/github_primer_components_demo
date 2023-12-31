# frozen_string_literal: true

class Proposal < ApplicationRecord
  validates :source, length: {minimum: 3}
  validates :destination, length: {minimum: 3}
end
