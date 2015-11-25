COMPONENT=fifo-grafana

include pkg.mk
.PHONY: package prepare clean

package: prepare $(FILE).tgz

prepare:
	-rm -r $(STAGE_DIR)/$(COMPONENT)
	-mkdir -p $(STAGE_DIR)/$(COMPONENT)
	cp -rip $(ROOT)/* $(STAGE_DIR)/$(COMPONENT)

clean: clean-pkg
	-rm *.tgz
