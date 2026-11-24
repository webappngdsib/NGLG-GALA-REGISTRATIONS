"""Convert the two original event tabs to private JSON on stdout."""
import datetime
import json
import sys
from zoneinfo import ZoneInfo

import openpyxl

workbook = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
registrations = []
for assembly, sheet in [('dec2026', 'DEC 2026'), ('may2027', 'MAY 2027')]:
    rows = workbook[sheet].iter_rows(min_row=2, max_col=10, values_only=True)
    for date, name, surname, salutation, office, province, lodge, partner, mobile, email in rows:
        if not any((date, name, surname, mobile)):
            continue
        status, separator, role = str(office or '').partition(' - ')
        if isinstance(date, datetime.datetime):
            date = date.replace(tzinfo=ZoneInfo('Europe/Athens')).isoformat()
        registrations.append({
            'assembly': assembly, 'created': str(date or ''), 'name': str(name or '').strip(),
            'surname': str(surname or '').strip(), 'salutation': str(salutation or '').strip(),
            'statusType': status if separator else '', 'office': role if separator else status,
            'province': str(province or '').strip(), 'lodge': str(lodge or '').strip(),
            'partner': int(partner or 0), 'mobile': str(mobile or '').strip(),
            'email': str(email or '').strip()
        })
json.dump(registrations, sys.stdout, ensure_ascii=False)
