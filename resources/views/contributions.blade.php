<!DOCTYPE html>
<html lang="en">
<head>
  <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Arial', sans-serif;
            background-image: url("{{ public_path('images/pdf_bg.jpg') }}");
            background-repeat: no-repeat;
            background-size: cover; /* or 'contain' based on your preference */
            background-position: center;
        }
        .page-break {
            page-break-after: always;
        }

        .page-space {
            margin-top:200px;
        }
        table {
            margin-left: 100px;
        }
        th {
            background-color: #f2f2f2;
=
            padding: 6px;
            font-size: 10px;
        }
        th,
        td {
            text-align: left;
            font-size: 12px;
        }
        .hidden {
            opacity: 0;
            visibility: 0;
        }
        th.sbr-date {
            width: 100px;
        }
        th.sbr-no {
            width: 120px;
        }
        th.year {
            width: 70px;
        }
        th.month {
            width: 100px;
        }
        th.ec {
            width: 50px;
        }
        th.total {
            width: 100px;
        }
        th.ss {
            width: 100px;
        }
        .info {
            margin-top: 50px;
            margin-left: 100px;
            margin-bottom: 20px;
        }

        .title {
            margin-top: 170px;
            margin-left: 100px;
            margin-bottom: 20px;
        }
        .dashed-line {
            border-top: 1px dashed #ddd; /* Change the color to your desired color */
            width: 100%; /* Adjust the width as needed */
            margin-top: 20px;
            margin-bottom: 20px;
        }
</style>
</head>
<body>
    <div class="title">
        <center>
                <h4 style='padding: 0px; margin: 0px'>CERTIFICATE OF SSS PREMIUM PAYMENTS</h4>
        </center>
    </div>
    <div class="info">

        @if ($displaySSSNo)
        <h5 style="padding: 0px; margin: 0px;">SSS No : {{ $displaySSSNo }}</h5>
        @endif

        @if ($displayName)
        <h5 style="padding: 0px; margin: 0px;">Name : {{ $displayName }}</h5>
        @endif

        @if ($displayCoverage)
        <h5 style="padding: 0px; margin: 0px;">Coverage: {{ $displayCoverage }}</h5>
        @endif
    </div>
    @php
        $currentYear = null;
    @endphp
    @foreach($contributions as $index => $contribution)
        @if($index > 0 && $index % 10 === 0)
            <div class="page-break"></div>
            <div class="page-space"></div>
        @endif
        <table>
            <thead>
                <tr>
                    <th class="{{ $index !== 0 ? 'hidden year' : 'year' }}">Year</th>
                    <th class="{{ $index !== 0 ? 'hidden month' : 'month' }}">Month</th>
                    <th class="{{ $index !== 0 ? 'hidden sbr-date' : 'sbr-date' }}">SBR Date</th>
                    <th class="{{ $index !== 0 ? 'hidden sbr-no' : 'sbr-no' }}">SBR No</th>
                    <th class="{{ $index !== 0 ? 'hidden ss' : 'ss' }}">SS</th>
                    <th class="{{ $index !== 0 ? 'hidden ec' : 'ec' }}">EC</th>
                    <!-- Add other columns as needed -->
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="{{ $currentYear === substr($contribution['batchDate'], 0, 4) ? 'hidden' : '' }}">{{ substr($contribution['batchDate'], 0, 4) }}</td>
                    <td>{{ Carbon\Carbon::parse($contribution['batchDate'])->format('F') }}</td>
                    <td>{{ $contribution['sbr_date'] }}</td>
                    <td>{{ $contribution['sbr_no'] }}</td>
                    <td>{{ $contribution['ss'] }}</td>
                    <td>{{ $contribution['ec'] }}</td>

                    <!-- Add other columns as needed -->
                </tr>
            </tbody>
        </table>
        @php
            $currentYear = substr($contribution['batchDate'], 0, 4);
        @endphp
    @endforeach

    <div class="dashed-line"></div>
    <center>=== Nothing Follows === </center>
    <br/>
    <br/>
    <center>
        <h5 style='padding: 0px; margin: 0px'>Employer Name : LOURDESS COLLEGE</h5>
        <h5 style='padding: 0px; margin: 0px'>Employer Number : 08-0027000-1</h5>
    </center>
    <center>
        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin: 0px'>Prepared By</h6>
            <p style='padding: 0px; margin: 0px'>MS. CRISTIE LYN. ABAMONGA</h5>
            <p style='padding: 0px; margin: 0px; font-size: 12px;'>Payroll Incharge</h5>
        </div>
        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin: 0px'>Noted By</h6>
            <p style='padding: 0px; margin: 0px'>S. MARIA ADEILA D. SERING, RVM</h5>
            <p style='padding: 0px; margin: 0px; font-size: 12px;'>Vice President for Finance</h5>
        </div>
    </center>
</body>
</html>


