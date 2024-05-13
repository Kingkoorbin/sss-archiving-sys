<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use PDF;
use App\Models\Contributions;
use Carbon\Carbon;
use App\Models\Client;

class GeneratePDFController extends Controller
{
    /**
     * Generates a PDF based on the given query parameters.
     *
     * @param Request $request The HTTP request object.
     * @return \Illuminate\Http\Response The PDF file response.
     */
    public function generatePDF(Request $request)
    {
        $displaySSSNo = $request->query('displaySSSNo');
        $displayName = $request->query('displayName');
        $displayCoverage = $request->query('displayCoverage');

        $name = $request->query('name');
        $sssNo = $request->query('sssNo');
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Contributions::query();

        if($sssNo) {
            $client = Client::findBySSSNo($sssNo)->first();
            if($client) {
                $displayName = $client->full_name;
                $displaySSSNo = $sssNo;
            }
        }
        
        if ($sssNo && !$from && !$to) {
            $query->where('sss_no', $sssNo);
            $displaySSSNo = $sssNo;
        }
        
        if ($name) {
            $query->where('name', 'ILIKE', "%$name%");
        }
        
        if ($sssNo && $from && $to) {
            $query->where('sss_no', $sssNo);
            $query->whereBetween('batchDate', [$from, $to]);
            $displaySSSNo = $sssNo;
        }
        
        $query->orderBy('batchDate', 'asc');

        $contributions = $query->get();

        $pdf = PDF::loadView('contributions', compact('contributions', 'displaySSSNo', 'displayName', 'displayCoverage'));
        $filename = now()->format('Y-m-d') . '_contribution';
        return $pdf->download("$filename.pdf");
    }
}
