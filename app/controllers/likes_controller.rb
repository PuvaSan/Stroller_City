class LikesController < ApplicationController
  before_action :find_review

  def toggle
    if @review.likes.exists?(user: current_user)
      unlike
    else
      like
    end

    render json: { likes_count: @review.likes.count, liked: @review.likes.exists?(user: current_user) }
  end

  private

  def find_review
    @review = Review.find(params[:review_id])
  end

  def like
    @review.likes.create(user: current_user)
  end

  def unlike
    @review.likes.find_by(user: current_user).destroy
  end
end
