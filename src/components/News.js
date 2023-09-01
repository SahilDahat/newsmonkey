import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';

export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 9,
    category : 'general'
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }

  constructor(props) {
    super(props);
    //console.log("Hi! This is constructor from News Component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title = this.props.category;
  }

  async updateNews(){
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}
    &apiKey=f1150d41464f4ae5b0fb9100359fa8c4&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    
    this.setState({ 
      loading: true 
    });

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

  async componentDidMount(){
    this.updateNews();
  }

handlePrevClick = async () => {
    this.setState({
      page: this.state.page - 1
    })
    this.updateNews();
  };

handleNextClick = async () => {
  this.setState({
    page: this.state.page + 1
  })
  this.updateNews();
};

  render() {
    //console.log("render");

    return (
        <div className="container my-3">
          <h1 className="text-center" style={{margin: '35 px, 0px'}}>NewsMonkey - Top Headlines</h1>
          {this.state.loading && <Spinner />} {/*This means if loading is true then show spinner */}
          <div className="row "> {/*my-4 */}
            {!this.state.loading && this.state.articles.map((element) => { //if loading=false then data is shown // console.log(element);
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} //ternary operator
                          description={element.description ? element.description : ""}
                          imageUrl={element.urlToImage}
                          newsUrl={element.url}
                          author = {element.author}
                          date = {element.publishedAt}/>
                </div>
            })}
          </div>

          <div className="container d-flex justify-content-evenly"> {/*content-between is used here */}
            <button disabled={this.state.page <= 1} type="button" className="btn btn-dark"
              onClick={this.handlePrevClick}>&larr; Previous</button>

            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
              type="button" className="btn btn-dark" onClick={this.handleNextClick}> Next &rarr;</button>
          </div>
        </div>
    );
  }
}

export default News;