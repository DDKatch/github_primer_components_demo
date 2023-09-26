# frozen_string_literal: true

module Custom
  class Button < Primer::Beta::Button
    def css_classes
      @system_arguments[:classes]
    end
  end
end
