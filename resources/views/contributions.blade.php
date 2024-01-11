<!DOCTYPE html>
<html>
<head>
    <title>Contributions</title>
    <style>
        body {
            font-family: 'Arial', sans-serif; /* Change 'Arial' to your desired formal font */
     
        }
        table {
            border-collapse: collapse;
        }
        th, td {
            padding: 6px;
            font-size: 10px;
        }
        th {
            background-color: #f2f2f2;
            text-align: left;
        }
        th.sbr-date, th.sbr-no {
            width: 70px; /* Set your desired default width */
        }
        th.name {
            width: 180px; /* Set your desired default width */
        }
        th.month {
            width: 55px; /* Set your desired default width */
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
    </style>
</head>
<body>
        <div class="info">
            @if ($displaySSSNo)
                <h5>SSS No  : {{ $displaySSSNo }}</h5>
            @endif

            @if ($displayName)
                <h5>Name    : {{ $displayName }}</h5>
            @endif

            @if ($displayCoverage)
                <h5>Coverage: {{ $displayCoverage }}</h5>
            @endif
        </div>
        @foreach($contributions as $batchIndex => $batch)
        <table>
            <tr>
                <th  class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">Year</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden month' : 'month' }}">Month</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">SSS No.</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden name' : 'name' }}">Name</th>
                <th class="{{ $batchIndex !== 0 ? 'hidden sbr-date' : 'sbr-date' }}">SBR Date</th>
                <th class="{{ $batchIndex !== 0 ? 'hidden sbr-no' : 'sbr-no' }}">SBR No</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">SS</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">EC</th>
                <th  class="{{ $batchIndex !== 0 ? 'hidden' : '' }}">Total</th>
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
</body>
</html>
