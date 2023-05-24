## Running the Application
Please ensure that you have Laravel, PHP, and Node.js installed and properly set up in your environment before proceeding with the following steps.

<br/>

### Step 1: Install Dependencies<br/>
Open a terminal or command prompt, navigate to the project directory, and run the following command to install the required dependencies:
```
    $ npm install
```

### Step 2: Start the Application <br/>
Once the dependencies are installed, run the following command to start the application:
```
    $ npm run start:app
```

## Migrations using PHP
```
    $ php artisan make:migration <MIGRATION_NAME> --create=<TABLE_NAME>
    $ php artisan migrate
```

## Migrations using NMP
```
    $ npm run migration:crate --name=migration_name --table=table_name
    $ npm run migration:run 
```

## Migrations | How to?

#### Create table
```
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number', 20)->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
```

#### Add column
```
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->nullable();
        });
    }
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
```




## Authors

- [@niks](https://github.com/kloyaa)

