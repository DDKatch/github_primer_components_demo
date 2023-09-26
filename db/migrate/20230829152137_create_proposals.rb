# frozen_string_literal: true

class CreateProposals < ActiveRecord::Migration[7.0]
  def change
    create_table :proposals do |t|
      t.string :source
      t.string :destination
      t.datetime :source_loading_date
      t.datetime :destination_unloading_date

      t.timestamps
    end
  end
end
