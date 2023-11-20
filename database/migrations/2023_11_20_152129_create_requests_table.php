<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->string('sss_no');
            $table->string('name');
            $table->date('date_of_employment');
            $table->date('date_of_resignation');
            $table->string('contribution');
            $table->string('requester');
            $table->string('email');
            $table->string('contact');
            $table->string('date_needed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
