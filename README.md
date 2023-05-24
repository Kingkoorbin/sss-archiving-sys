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

