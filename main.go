package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Product ...
type Product struct {
	ProductID      int    `json:"productId"`
	Manufacturer   string `json:"manufactorer"`
	Sku            string `json:"sku"`
	Upc            string `json:"upc"`
	PricePerUnit   string `json:"pricePerUnit"`
	QuantityOnHand int    `json:"quantityOnHand"`
	ProductName    string `json:"productName"`
}

var productList []Product

func getNextID() int {
	highestID := -1
	for _, product := range productList {
		if highestID < product.ProductID {
			highestID = product.ProductID
		}
	}

	return highestID + 1
}

func productsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		productJSON, err := json.Marshal(productList)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(productJSON)
	case http.MethodPost:
		var newProduct Product
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err = json.Unmarshal(bodyBytes, &newProduct)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if newProduct.ProductID != 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		newProduct.ProductID = getNextID()
		productList = append(productList, newProduct)
		w.WriteHeader(http.StatusCreated)
		return
	}
}

func findProdutByID(productID int) (*Product, int) {
	for i, product := range productList {
		if product.ProductID == productID {
			return &product, i
		}
	}

	return nil, 0
}

func productHandler(w http.ResponseWriter, r *http.Request) {
	urlPathSegments := strings.Split(r.URL.Path, "products/")
	productID, err := strconv.Atoi(urlPathSegments[len(urlPathSegments)-1])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	product, listItemIndex := findProdutByID(productID)
	if product == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	switch r.Method {
	case http.MethodGet:
		productJSON, err := json.Marshal(product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(productJSON)
	case http.MethodPut:
		var updateProduct Product
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err = json.Unmarshal(bodyBytes, &updateProduct)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if updateProduct.ProductID != productID {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		product = &updateProduct
		productList[listItemIndex] = *product
		w.WriteHeader(http.StatusOK)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
func middlewareHandler(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("before hanlder; middleware start")
		start := time.Now()
		handler.ServeHTTP(w, r)
		fmt.Printf("After hanlder; middleware finised %s", time.Since(start))
	})
}
func main() {
	productListHandler := http.HandlerFunc(productsHandler)
	productItemHanlder := http.HandlerFunc(productHandler)
	http.Handle("/products", middlewareHandler(productListHandler))
	http.Handle("/products/", middlewareHandler(productItemHanlder))
	err := http.ListenAndServe(":5000", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func init() {
	productsJSON := `[
		{
		  "productId": 1,
		  "manufacturer": "Johns-Jenkins",
		  "sku": "p5z343vdS",
		  "upc": "939581000000",
		  "pricePerUnit": "497.45",
		  "quantityOnHand": 9703,
		  "productName": "sticky note"
		},
		{
		  "productId": 2,
		  "manufacturer": "Hessel, Schimmel and Feeney",
		  "sku": "i7v300kmx",
		  "upc": "740979000000",
		  "pricePerUnit": "282.29",
		  "quantityOnHand": 9217,
		  "productName": "leg warmers"
		},
		{
		  "productId": 3,
		  "manufacturer": "Swaniawski, Bartoletti and Bruen",
		  "sku": "q0L657ys7",
		  "upc": "111730000000",
		  "pricePerUnit": "436.26",
		  "quantityOnHand": 5905,
		  "productName": "lamp shade"
		}
	  ]`

	err := json.Unmarshal([]byte(productsJSON), &productList)
	if err != nil {
		log.Fatal(err)
	}
}
