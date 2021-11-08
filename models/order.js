import * as moment from "moment";
class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
  }
  get readableDate() {
    return this.date.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    //return moment(this.date).format("MMMM Do YYYY, h:mm a"); // March 18th 2021, 12:39:17 pm
  }
}
export default Order;
