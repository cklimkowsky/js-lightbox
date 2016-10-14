/**
 * @class FlickrApi
 * @classdesc Serves as a wrapper to the Flickr API to
 * retrieve the photos within a given photoset
 */
class FlickrApi {

  /**
   * Creates a new FlickrAPI
   * @param  {String} photosetId ID of the respective photoset to retrieve
   * @return {FlickrApi}
   */
  constructor(photosetId) {
    // TODO: Hide API key from GitHub
    this.apiKey = 'd25bfd5e4f8bd67871b131d73825ca74';
    this.apiMethod = 'flickr.photosets.getPhotos';
    this.photosetId = photosetId;
    this.requestUrl = this.createRequestUrl();
  }

  /**
   * Generates a URL to fetch data for a photoset from the Flickr API
   * @return {String} URL that fetches photoset data from Flickr
   */
  createRequestUrl() {
    const methodParam = `method=${this.apiMethod}`;
    const apiKeyParam = `api_key=${this.apiKey}`;
    const photosetIdParam = `photoset_id=${this.photosetId}`;
    const formatParam = 'format=json';
    const queryParams = [
      methodParam,
      apiKeyParam,
      photosetIdParam,
      formatParam,
    ].join('&');

    return `https://api.flickr.com/services/rest/?${queryParams}`;
  }

  /**
   * Sends the request to the Flickr API
   * @return {Promise} Promise-wrapped XHR request
   */
  makeRequest() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', this.requestUrl);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => {
        reject(xhr.statusText);
      };
      xhr.send();
    }).then((response) => this.parseResponse(response));
  }

  /**
   * Handle the response from the Flickr API
   * @param  {String} response String response containing photo data
   * @return {Object}          Object representation of API data
   */
  parseResponse(response) {
    const responseText = response.match(/jsonFlickrApi\((.*)\)/)[1];
    const thumbnailsList = document.querySelector('.thumbnails-list');

    // Parse the text response into JSON
    const jsonResponse = JSON.parse(responseText);

    if (!jsonResponse.photoset) {
      throw new Error(jsonResponse.message);
    }

    return jsonResponse.photoset.photo;
  }
}

export default FlickrApi;
