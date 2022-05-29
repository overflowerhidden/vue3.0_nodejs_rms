import QueryForm from "./QueryForm";
import BaseTable from "./BaseTable";

export default {
  install(app) {
    app.use(QueryForm)
    app.use(BaseTable)
  }
}