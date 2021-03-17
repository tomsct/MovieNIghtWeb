const Movie = require("../models/MovieModel");
const Review = require("../models/ReviewModel");
const AppError = require("../utils/AppError");
const { reviewSchema } = require("../schemas");
const fs = require('fs')
let ejs = require('ejs');

exports.movie_reviews = async (req, res, next) => {
    const movie = await Movie.findOne({ "imdbID": req.params.id });
    const review = new Review(req.body.review);
    movie.Reviews.push(review);
    await review.save();
    await movie.save();
    let file = fs.readFileSync("views/partials/review.ejs", 'ascii');
    let rendered = ejs.render(file, { review: review , user: req.user });
    res.send(rendered);
};

exports.validate_review = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(el => el.message).join(`,`);
        res.status(400).send();
        throw new AppError(msg, 400);
    }
    else
        next();
}

exports.delete_review = async (req, res, next) => {
    res.send(await Review.findByIdAndDelete(req.params.reviewID));
}
