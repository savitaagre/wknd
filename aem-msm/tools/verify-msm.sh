#!/usr/bin/env bash
# Read-only check of the WKND MSM setup on an AEM author.
#
# Usage:
#   AEM_HOST=https://author-pXXXX-eYYYY.adobeaemcloud.com AEM_TOKEN=<local dev token> ./verify-msm.sh
#   AEM_HOST=http://localhost:4502 AEM_USER=admin AEM_PASS=admin ./verify-msm.sh   # local SDK
#
# Get AEM_TOKEN from Developer Console > Integrations > Local token. Never commit it.
# Requires curl and jq. Only GET requests are made.

set -u
: "${AEM_HOST:?Set AEM_HOST}"

if [ -n "${AEM_TOKEN:-}" ]; then
  AUTH=(-H "Authorization: Bearer ${AEM_TOKEN}")
else
  AUTH=(-u "${AEM_USER:-admin}:${AEM_PASS:-admin}")
fi

ROLLOUT=/apps/msm/wknd/rolloutconfigs/wknd-standard-rollout
BLUEPRINT=/apps/msm/wknd/blueprintconfigs/wknd-language-masters
MASTERS=/content/wknd/language-masters

# live copy root -> expected source (language master)
LIVE_COPIES="
us/en:en
us/es:es
ca/en:en
ca/fr:fr
ch/de:de
ch/fr:fr
ch/it:it
de/de:de
fr/fr:fr
es/es:es
it/it:it
"

pass=0; fail=0
ok() { echo "PASS  $1"; pass=$((pass + 1)); }
ko() { echo "FAIL  $1"; fail=$((fail + 1)); }
get() { curl -sf "${AUTH[@]}" "${AEM_HOST}$1"; }

# 1. Rollout configuration deployed with the expected trigger and action order
if json=$(get "${ROLLOUT}.1.json"); then
  trigger=$(jq -r '."cq:trigger"' <<<"$json")
  actions=$(jq -r '[to_entries[] | select(.value | type == "object") | .key] | join(",")' <<<"$json")
  [ "$trigger" = "rollout" ] && ok "rollout config trigger = rollout" || ko "rollout config trigger is '$trigger'"
  [ "$actions" = "contentUpdate,contentCopy,contentDelete,referencesUpdate,orderChildren" ] \
    && ok "rollout config actions in order" || ko "rollout config actions: $actions"
else
  ko "rollout config not found at ${ROLLOUT}"
fi

# 2. Blueprint configuration points at the language masters
if json=$(get "${BLUEPRINT}/jcr:content.json"); then
  [ "$(jq -r '.sitePath' <<<"$json")" = "$MASTERS" ] && ok "blueprint sitePath = $MASTERS" || ko "blueprint sitePath wrong"
else
  ko "blueprint config not found at ${BLUEPRINT}"
fi

# 3. Language masters exist
for lang in en es fr de it; do
  get "${MASTERS}/${lang}/jcr:content.json" >/dev/null \
    && ok "language master ${lang} exists" || ko "language master ${lang} missing"
done

# 4. Every country root is a deep live copy of the right master
for entry in $LIVE_COPIES; do
  lc=${entry%%:*}; src=${entry##*:}
  if json=$(get "/content/wknd/${lc}/jcr:content/cq:LiveSyncConfig.json"); then
    master=$(jq -r '."cq:master"' <<<"$json")
    deep=$(jq -r '."cq:isDeep"' <<<"$json")
    [ "$master" = "${MASTERS}/${src}" ] && ok "${lc} source = ${master}" || ko "${lc} source is '${master}'"
    [ "$deep" = "true" ] && ok "${lc} is a deep live copy" || ko "${lc} is not deep"
  else
    ko "${lc} is not a live copy (no cq:LiveSyncConfig)"
  fi
done

echo
echo "${pass} passed, ${fail} failed"
[ "$fail" -eq 0 ]
