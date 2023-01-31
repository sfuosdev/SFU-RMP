import { store } from "../js/storage.js"
import { retreive } from "../js/storage.js"

describe("test storing key,value to local storage and retrieving", () => {

  
  test("add then retrieve", () => {
    store("test", "Value")
	  expect(retreive("test")).toBe("Value");
  });

})

