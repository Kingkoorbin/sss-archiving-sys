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
        Schema::table('clients', function (Blueprint $table) {
            $table->string('personnel_category')->default('');
            $table->string('suffix')->default('');
            $table->string('civil_status')->default('');
            $table->string('blood_type')->nullable();
            $table->string('email')->default('');
            $table->string('tin')->nullable();
            $table->string('sss_no')->default('');
            $table->string('philhealth_no')->nullable();
            $table->string('pagibig_no')->nullable();
            $table->string('rvm_retirement_no')->nullable();
            $table->string('bpi_atm_account_no')->nullable();
            $table->string('date_hired')->default('');
            $table->string('date_resigned')->nullable();
            $table->string('main_employer')->default('');
            $table->string('address')->default('');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            // Reverse the changes made in the up() method
            $table->dropColumn([
                'personnel_category',
                'suffix',
                'civil_status',
                'blood_type',
                'email',
                'tin',
                'sss_no',
                'philhealth_no',
                'pagibig_no',
                'rvm_retirement_no',
                'bpi_atm_account_no',
                'date_hired',
                'date_resigned',
                'main_employer',
                'address',
            ]);
        });
    }
};
