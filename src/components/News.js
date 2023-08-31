import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
export class News extends Component {

  static defaultProps = {
    country:'in',
    pageSize: 9,
    category : 'general'
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }

  constructor() {
    super();
    //console.log("Hi! This is constructor from News Component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    //console.log("CDM");
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=business&apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    //console.log(data);
    let parsedData = await data.json();
    //console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    });
  }

  handlePrevClick = async () => {
    console.log("Previous");
    let url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=${
      this.props.page - 1
    }&pageSize=${this.props.pageSize}`;
    //https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=${this.state.page - 1}
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false
    });
  };
  /*  1. Hi! This is constructor from News Component
      2. render
      3. CDM   */

  handleNextClick = async () => {
    //console.log("Next");
    if (
      !(
        this.state.page + 1 >
        Math.ceil(this.state.totalResults / this.props.pageSize)
      )
    ) {
      let url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=${
        this.state.page + 1
      }&pageSize=${this.props.pageSize}`;
      //https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=${this.state.page + 1}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      //console.log(parsedData);
      this.setState({
        loading: false,
        page: this.state.page + 1,
        articles: parsedData.articles,
      });
    }
  };

  render() {
    //console.log("render");

    return (
      <>
        <div className="container my-3">
          <h1 className="text-center">NewsMonkey - Top Headlines</h1>
          {this.state.loading && <Spinner />}{" "}
          {/*This means if loading is true then show spinner */}
          <div className="row my-4">
            {!this.state.loading && this.state.articles.map((element) => {
              //if loading is false then show the data
              // console.log(element);

              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""} //ternary operator
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                  />
                </div>
              );
            })}
          </div>
          <div className="container d-flex justify-content-evenly">
            <button
              disabled={this.state.page <= 1}
              type="button"
              className="btn btn-dark"
              onClick={this.handlePrevClick}
            >
              {" "}
              &larr; Previous
            </button>
            <button
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              type="button"
              className="btn btn-dark"
              onClick={this.handleNextClick}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default News;
