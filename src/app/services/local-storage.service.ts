import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  // Create LocalStorage Propery If Not Exists Or Update Existing One With New Data
  addLocalStorageItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  deleteLocalStorageProperty(keyItems: any[]) {
    keyItems.map((itemKey) => {
      localStorage.removeItem(itemKey);
    });
  }

  getLocalStoragePropertyIfExists(items: any): any[] {
    let newItemsArray: any[] = [];
    for (let index = 0; index < localStorage.length; index++) {
      items.map((item) => {
        item === localStorage.key(index)
          ? (newItemsArray = [
              ...newItemsArray,
              { [item]: localStorage.getItem(item) },
            ])
          : false;
      });
    }

    return newItemsArray;
  }

  isPropertyInLocalStorage(items: any): boolean {
    let isInLocalStorage: boolean = false;

    items.map((item) => {
      // Validate LocalStorage Object Types
      // try {
      //   JSON.parse(localStorage.getItem(item)).length > 0
      //     ? (isInLocalStorage = true)
      //     : isInLocalStorage
      //     ? (isInLocalStorage = true)
      //     : (isInLocalStorage = false);
      //   // Validate LocalStorage String Types
      // } catch (e) {
      for (let index = 0; index < localStorage.length; index++) {
        item === localStorage.key(index)
          ? (isInLocalStorage = true)
          : isInLocalStorage
          ? (isInLocalStorage = true)
          : (isInLocalStorage = false);
      }
      // }
    });
    return isInLocalStorage;
  }

  isPropertyIdInLocalStorageMatched(
    item: any,
    propertyToCompare: any,
    compareSign: string
  ): boolean {
    let isMatched: boolean = false;

    // Validate If Property To Comprate & Local Storage Property Are Equal
    compareSign === "equal"
      ? propertyToCompare === JSON.parse(localStorage.getItem(item))._id
        ? (isMatched = true)
        : (isMatched = false)
      : // Validate If Property To Comprate & Local Storage Property Are Different
      propertyToCompare !== JSON.parse(localStorage.getItem(item))._id
      ? (isMatched = true)
      : (isMatched = false);

    return isMatched;
  }

  isPropertyValueInLocalStorageMatched(
    storagePropertiesArray: any,
    propertyToCompare: any
  ): boolean {
    let isMatched: boolean = false;

    propertyToCompare ===
    JSON.parse(localStorage.getItem(storagePropertiesArray))
      ? (isMatched = true)
      : (isMatched = false);

    return isMatched;
  }

  pushElementToStorageProperty(key: string, items: object) {
    const oldStorageData = JSON.parse(localStorage.getItem(key));
    const newStorageData = [...oldStorageData, items];

    localStorage.setItem(key, JSON.stringify(newStorageData));
  }

  resetLocalStorage() {
    var email = localStorage.getItem("email");
    localStorage.clear();
    localStorage.setItem("email", email);
  }

  updateStorageItem(item: any, itemType: string) {
    if (this.isPropertyInLocalStorage([itemType])) {
      JSON.parse(localStorage.getItem(itemType)).filter((localStorageItem) => {
        return localStorageItem._id !== item._id;
      });
    }
  }
}
