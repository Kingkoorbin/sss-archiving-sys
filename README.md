## Running the Application
Please ensure that you have Laravel, PHP, and Node.js installed and properly set up in your environment before proceeding with the following steps.

#### Step 1: Install Dependencies<br/>
Open a terminal or command prompt, navigate to the project directory, and run the following command to install the required dependencies:
```
    $ npm install
```

## Seeds using PHP
Run seeding to initialize admin account
```
    $ php artisan run:seeds
```

#### Step 2: Start the Application <br/>
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
    class CreateExampleTable extends Migration
    {
        public function up()
        {
            Schema::create('example', function (Blueprint $table) {
                $table->id();
                $table->integer('integer_field');
                $table->bigInteger('big_integer_field');
                $table->string('string_field');
                $table->text('text_field');
                $table->boolean('boolean_field')->default(true);
                $table->date('date_field');
                $table->dateTime('date_time_field');
                $table->time('time_field');
                $table->float('float_field', 8, 2);
                $table->decimal('decimal_field', 10, 2);
                $table->enum('enum_field', ['value1', 'value2', 'value3']);
                $table->json('json_field');
                $table->jsonb('jsonb_field');
                $table->binary('binary_field');
                $table->uuid('uuid_field');
                $table->ipAddress('ip_address_field');
                $table->timestamps();
            });
        }

        public function down()
        {
            Schema::dropIfExists('example');
        }
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

