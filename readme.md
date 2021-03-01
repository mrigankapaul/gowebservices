### CMD to run mysql
```
docker run --rm -it -d -v ${PWD}/data:/var./lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql
docker exec -it beautiful_grothendieck sh -c 'exec mysql -uroot -p"password"'
```
### CMDs for angular
```
sudo npm install -g @angular/cli
npm install
npm update
ng serve --open
http://localhost:4200/home
```
### Handling HTTP Request<br>
- http.Handle - Register a **handler** to handle requests matching a pattern.
- http.HandleFunc - Registers a **function** to handle requests matching a pattern.


### Using http.Handle
```
fun Handle(pattern string, handler Handler)

type Handler interface {
    ServerHTTP(ResponseWriter, *Request)
}
///////////
main.go

import "net/http"

type fooHandler struct {
    Message string
}

func (f *fooHandler) ServeHTTP(w http.ResponseWriter, *http.Request) {
    w.Write([]byte(f.Message))
}

func main() {
    http.Handle("/foo", &fooHandler{Message: "hello world"})
}
```

### http.HandleFunc
```
main.go 

import "net/http"

func main() {
    foo := func(w http.ResponseWriter, _ *http.Request) {
        w.Write([]byte(f.Message))    
    }

    http.HandleFunc("/foo", foo)
    err := http.ListenAndServe(":5000", nil) // nil for default ServeMux 
    // for secured http
    // func ListernAndServeTLS(addr, certFile, keyFile, string, hanlder Handler)
    if err != nil {
        log.Fatal(err)
    }
}
```
### JSON Marshalling and Unmarshalling
```

type Product struct {
	ProductID      int    `json:"productId"`
	Manufacturer   string `json:"manufactorer"`
	Sku            string `json:"sku"`
	Upc            string `json:"upc"`
	PricePerUnit   string `json:"pricePerUnit"`
	QuantityOnHand string `json:"quantityOnHand"`
	ProductName    string `json:"productName"`
}


	// Marshalling a struct to JSON
	data, _ := json.Marshal(&foo{"4score", 56, "Abe", "Lincoln"})
	fmt.Println(string(data))

	// unmarshalling JSON to struct type
	f := foo{}
	err := json.Unmarshal([]byte(`{"Message":"4score","Age":56,"Name":"Abe"}`), &f)
	if err != nil {
		log.Fatal((err))
	}

	fmt.Println(f.Message, f.Age, f.Name)
```

### Working with Requests
- Request.Method string
- Request.Header - Header(map[string][] string)
- Request.Body - io.ReadCloser

### Middleware
```
    func middlewareHandler(func(w http.ResponseWriter, r *http.Request)) {
        // do stuff before intended handler here
        hanlder.ServeHTTP(w,r)
        // do stuff after intended handler here
    }

    func intendedFunction(w http.ResponseWriter, r *http.Request) {
        // business logic here 
    }

    func main() {
        intendedHandler := http.HandlerFunc(intendedFunction)
        http.Handle("/foo", middlewareHandler(intendedHandler))
        http.ListenAndServe(":5000", nil)
    }
```

### CORS Headers

main.go

```
w.Header().Add("Access-Control-Allow-Origin", "*") // "*" allows any origin
w.Header().Add("Access-Conrol-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
w.Header().Add("Access-Control-Allow-Headers", "Accept, Content-Type, Content- Length, Authorization, X-CSRF-Token, Access-Encoding")
```

### Connecting to a database

database.go

```
imort "database/sql"

var DbConn *sql.DB

func SetupDatabase() {
    var err error 
    DBConn, err = sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/inventorydb)
    if err != nil {
        log.Fatal(err)
    }
}
```

### Querying the database

```
func (db *DB) Query(query string, args ...interface{}) (*Rows, error)
func (rs *Rows) Scan(dest ...interface{}) error
func (db *DB) QueryRow(query string, args ...interface{}) *Row // when the result in only 1 row.
func (rs *Row) Scan(dest ...interface{}) error
```

### Executing SQL Statements

```
func (rs *DB) Exec(query string, args ...interface{}) (Result, error)

type Result interface {
    LastInsertId() (int64, error)
    RowsAffected() (int64, error)
}
```

### Context 

    - Allows you to set deadline, cancel a signal, or set other request-scoped values across API boundaries and between processes.

### Uploading and downloading files

- Base64 encoding 
    ```
    func (enc *Encoding) DecodeString(s string)([] byte, error)
    ```
    ```
        str := "scnksncksnckscks"
        output, err := base64.StdEncoding.DecodeString(str)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Println("%d\n", output)
    ```
- Multi-part 
    ```
        func(r *Request) FormFile(key string) (multipart.File, *multiart.FileHeader, error)

        type File interface {
            io.Reader
            io.ReaderAt
            io.Seeker
            io.Closer
        }

        type FileHeader struct {
            Filename string
            Header textproto.MIMEHEader
            Size int64
        }
    ```

### WebSockets
    - Client sends HTTp GET request 
        - Connection:Upgrade
        - Upgrade:websocket
        - Sec-WebSocket-Key:key
    - Server Response with status code of 101
        - switching protocols
        - Connection:Upgrade
        - Upgrade:websocket
        - Sec-WebSocket-Key:key
```
type Conn struct { // webscocket.conn websocket connection type
    PayloadType byte
    MaxPayloadBytes int
}

type Codec struct { // Codec
    Marhsal func(v interface{}) (data []byte, payloadType byte, err error)
    Unmarshal func(data []byte, payloadType byte, v interface{}) (err error)
}

codec.Receive

func (cd Codec) Receive(ws *Conn, v interface{}) (err error)
func (cd Codec) Send(ws *Conn, v interface{}) (err error)

```
