<!DOCTYPE html>
<html>

<head>
    <title>Contributions</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            /* Change 'Arial' to your desired formal font */

        }

        table {
            border-collapse: collapse;
        }

        th,
        td {
            padding: 6px;
            font-size: 10px;
        }

        th {
            background-color: #f2f2f2;
            text-align: left;
        }

        th.sbr-date,
        th.sbr-no {
            width: 70px;
            /* Set your desired default width */
        }

        th.name {
            width: 190px;
            /* Set your desired default width */
        }

        th.month {
            width: 55px;
            /* Set your desired default width */
        }
        th.ec {
            width: 20px;
            /* Set your desired default width */
        }
        th.total {
            width: 50px;
            /* Set your desired default width */
        }
        th.ss {
            width: 50px;
            /* Set your desired default width */
        }
        .hidden {
            opacity: 0;
            visibility: 0;
        }

        h5 {
            padding: 0px;
            margin: 0px;
        }

        .info {
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
    <div class="info">
        @if ($displaySSSNo)
        <h5>SSS No : {{ $displaySSSNo }}</h5>
        @endif

        @if ($displayName)
        <h5>Name : {{ $displayName }}</h5>
        @endif

        @if ($displayCoverage)
        <h5>Coverage: {{ $displayCoverage }}</h5>
        @endif
    </div>
    @foreach($contributions as $batchIndex => $batch)
    <table>
        <tr>
            <th class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">Year</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden month' : 'month' }}">Month</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">SSS No.</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden name' : 'name' }}">Name</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden sbr-date' : 'sbr-date' }}">SBR Date</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden sbr-no' : 'sbr-no' }}">SBR No</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden ss': 'ss' }}">SS</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden ec' : 'ec' }}">EC</th>
            <th class="{{ $batchIndex !== 0 ? 'hidden total' : 'total' }}">Total</th>
        </tr>
        @foreach($batch['contributions'] as $index => $contribution)
        <tr>
            <td> @if($index === 0){{ substr($batch['batch'], 0, 4) }} @endif</td>
            <td>{{ $contribution->month }}</td>
            <td>{{ $contribution->sss_no }}</td>
            <td>{{ $contribution->name }}</td>
            <td>{{ $contribution->sbr_date }}</td>
            <td>{{ $contribution->sbr_no }}</td>
            <td>{{ $contribution->ss }}</td>
            <td>{{ $contribution->ec }}</td>
            <td>{{ $contribution->total }}</td>
        </tr>
        @endforeach
    </table>
    @endforeach
    <div class="dashed-line"></div>
    <center>=== Nothing Follows === </center>
    <br/>
    <br/>
    <br/>
    <center>
        <h4 style='padding: 0px; margin: 0px'>Employer Name : LOURDESS COLLEGE</h4>
        <h4 style='padding: 0px; margin: 0px'>Employer Number : 08-0027000-1</h4>
    </center>
    <center>
        <div style=' margin-top: 50px; '>
            <h5 style='padding: 0px; margin: 0px'>Prepared By</h5>
            <p style='padding: 0px; margin: 0px'>MS. CRISTIE LYN. ABAMONGA</h5>
            <p style='padding: 0px; margin: 0px; font-size: 12px;'>Payroll Incharge</h5>
        </div>
        <div style=' margin-top: 50px; '>
            <h5 style='padding: 0px; margin: 0px'>Noted By</h5>
            <p style='padding: 0px; margin: 0px'>S. MARIA ADEILA D. SERING, RVM</h5>
            <p style='padding: 0px; margin: 0px; font-size: 12px;'>Vice President for Finance</h5>
        </div>
    </center>
</body>

</html>